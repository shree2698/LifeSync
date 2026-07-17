import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { HealthService } from "@lifesync/services"

export async function GET(request: Request) {
  try {
    if (process.env.DATABASE_URL) {
      const mockUserId = "u-1" // Mock user session (Clerk fallback)
      const todayStr = new Date().toISOString().split("T")[0]

      // 1. Fetch or create Health Profile
      let profile = await prisma.healthProfile.findUnique({
        where: { userId: mockUserId },
      })
      if (!profile) {
        profile = await prisma.healthProfile.create({
          data: {
            userId: mockUserId,
            height: 175,
            weight: 70,
            targetWeight: 65,
            waterGoal: 2000,
            sleepGoal: 8.0,
            workoutGoal: 150,
            cycleGoal: 28,
          },
        })
      }

      // 2. Fetch today's Water Logs
      const startOfDay = new Date(todayStr + "T00:00:00.000Z")
      const endOfDay = new Date(todayStr + "T23:59:59.999Z")
      const waterLogs = await prisma.waterLog.findMany({
        where: {
          userId: mockUserId,
          date: { gte: startOfDay, lte: endOfDay },
        },
      })
      const todayWater = waterLogs.reduce((sum, log) => sum + log.amount, 0)

      // 3. Fetch today's Sleep Log
      const sleepLog = await prisma.sleepLog.findFirst({
        where: {
          userId: mockUserId,
          date: { gte: startOfDay, lte: endOfDay },
        },
      })

      // 4. Fetch today's Workouts
      const workouts = await prisma.workout.findMany({
        where: {
          userId: mockUserId,
          date: { gte: startOfDay, lte: endOfDay },
        },
        include: { exercises: true },
      })
      const workoutProgress = workouts.reduce((sum, w) => sum + w.duration, 0)

      // 5. Fetch latest Weight Log
      const weightLog = await prisma.weightLog.findFirst({
        where: { userId: mockUserId },
        orderBy: { date: "desc" },
      })

      // 6. Fetch Medications status
      const medications = await prisma.medication.findMany({
        where: { userId: mockUserId, active: true },
      })
      const medLogs = await prisma.medicationLog.findMany({
        where: {
          medication: { userId: mockUserId },
          takenAt: { gte: startOfDay, lte: endOfDay },
          status: "TAKEN",
        },
      })

      const medList = medications.map((m) => ({
        ...m,
        id: m.id,
        takenToday: medLogs.some((l) => l.medicationId === m.id),
      }))

      const takenMeds = medList.filter((m) => m.takenToday).length
      const totalMeds = medList.length

      // 7. Women's Health Cycle status
      const latestCycle = await prisma.cycle.findFirst({
        where: { userId: mockUserId },
        orderBy: { startDate: "desc" },
      })
      let currentDay = null
      let phase = null
      let isPeriodToday = false
      let daysUntilPeriod = null

      if (latestCycle) {
        const diffTime = Math.abs(Date.now() - latestCycle.startDate.getTime())
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
        const cycleGoal = profile.cycleGoal || 28
        currentDay = (diffDays % cycleGoal) + 1

        if (currentDay <= 5) {
          phase = "Menstruation"
          isPeriodToday = true
        } else if (currentDay <= 11) {
          phase = "Follicular"
        } else if (currentDay <= 15) {
          phase = "Ovulation"
        } else {
          phase = "Luteal"
        }
        daysUntilPeriod = Math.max(0, cycleGoal - currentDay)
      }

      // 8. Today's Mood Log
      const todayMood = await prisma.moodLog.findFirst({
        where: {
          userId: mockUserId,
          date: { gte: startOfDay, lte: endOfDay },
        },
      })

      // 9. Hair Routine Status
      const hairRoutines = await prisma.hairRoutine.findMany({
        where: { userId: mockUserId, active: true },
      })
      const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
      const todayDayName = daysOfWeek[new Date().getDay()]
      const activeHairRoutine = hairRoutines[0] || null

      const washDay = activeHairRoutine ? activeHairRoutine.washDays.includes(todayDayName) : false
      const oilDay = activeHairRoutine ? activeHairRoutine.oilDays.includes(todayDayName) : false
      const maskDay = activeHairRoutine ? activeHairRoutine.maskDays.includes(todayDayName) : false

      const hairLog = await prisma.hairLog.findFirst({
        where: {
          userId: mockUserId,
          date: { gte: startOfDay, lte: endOfDay },
        },
      })

      const hairRoutineStatus = {
        washDay,
        oilDay,
        maskDay,
        washDone: hairLog ? hairLog.washDone : false,
        oilDone: hairLog ? hairLog.oilDone : false,
        maskDone: hairLog ? hairLog.maskDone : false,
      }

      // 10. Skin Routine Status
      const skinRoutines = await prisma.skinRoutine.findMany({
        where: { userId: mockUserId, active: true },
      })
      const morningRoutine = skinRoutines.find((r) => r.name.toLowerCase().includes("morning"))
      const nightRoutine = skinRoutines.find((r) => r.name.toLowerCase().includes("night"))

      const skinLogs = await prisma.skinLog.findMany({
        where: {
          userId: mockUserId,
          date: { gte: startOfDay, lte: endOfDay },
        },
      })

      const morningLog = skinLogs.find((l) => l.routineId === morningRoutine?.id)
      const nightLog = skinLogs.find((l) => l.routineId === nightRoutine?.id)

      const skinRoutineStatus = {
        morningDone: morningLog ? morningLog.completed : false,
        nightDone: nightLog ? nightLog.completed : false,
      }

      // 11. Upcoming Reminders
      const reminders = await prisma.healthReminder.findMany({
        where: { userId: mockUserId, enabled: true },
      })

      // 12. Weekly Summary (mon-sun)
      const waterIntake = [1800, 2100, 1500, 2200, 1900, 2000, todayWater]
      const sleepDuration = [7.0, 8.2, 6.5, 7.5, 8.0, 7.8, sleepLog ? sleepLog.duration : 0]
      const workoutMinutes = [45, 0, 30, 60, 45, 0, workoutProgress]

      return NextResponse.json({
        success: true,
        message: "Health dashboard loaded from database",
        data: {
          profile,
          todayWater,
          waterGoal: profile.waterGoal,
          todaySleep: sleepLog,
          sleepGoal: profile.sleepGoal,
          todayWorkouts: workouts,
          workoutProgress,
          workoutGoal: profile.workoutGoal,
          currentWeight: weightLog ? weightLog.weight : profile.weight,
          targetWeight: profile.targetWeight,
          medicationStatus: {
            taken: takenMeds,
            total: totalMeds,
            list: medList,
          },
          cycleStatus: {
            currentDay,
            phase,
            isPeriodToday,
            daysUntilPeriod,
          },
          todayMood,
          hairRoutineStatus,
          skinRoutineStatus,
          upcomingReminders: reminders,
          weeklySummary: {
            waterIntake,
            sleepDuration,
            workoutMinutes,
          },
        },
      })
    }

    // Fallback to mock in-memory service
    const res = await HealthService.getHealthDashboard()
    return NextResponse.json(res)
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message || "Failed to load health dashboard" },
      { status: 500 }
    )
  }
}
