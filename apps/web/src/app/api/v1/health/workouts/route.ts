import { NextResponse } from "next/server"
import * as z from "zod"
import prisma from "@/lib/prisma"
import { WorkoutService } from "@lifesync/services"

const exerciseSchema = z.object({
  name: z.string().min(1, "Exercise name is required"),
  sets: z.number().nullable().optional(),
  reps: z.number().nullable().optional(),
  weight: z.number().nullable().optional(),
  duration: z.number().nullable().optional(),
})

const workoutLogSchema = z.object({
  title: z.string().min(1, "Workout title is required"),
  category: z.string().min(1, "Category is required"),
  duration: z.number().min(1, "Duration must be at least 1 minute"),
  calories: z.number().nullable().optional(),
  notes: z.string().nullable().optional(),
  date: z.string().optional(),
  exercises: z.array(exerciseSchema).optional(),
})

export async function GET(request: Request) {
  try {
    if (process.env.DATABASE_URL) {
      const mockUserId = "u-1"
      const dbWorkouts = await prisma.workout.findMany({
        where: { userId: mockUserId },
        include: { exercises: true },
        orderBy: { date: "desc" },
      })
      return NextResponse.json({ success: true, message: "Workouts loaded", data: dbWorkouts })
    }

    const res = await WorkoutService.getWorkouts()
    return NextResponse.json(res)
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const validatedData = workoutLogSchema.parse(body)

    if (process.env.DATABASE_URL) {
      const mockUserId = "u-1"
      
      const dbWorkout = await prisma.workout.create({
        data: {
          title: validatedData.title,
          category: validatedData.category,
          duration: validatedData.duration,
          calories: validatedData.calories || null,
          notes: validatedData.notes || null,
          date: validatedData.date ? new Date(validatedData.date) : new Date(),
          userId: mockUserId,
          exercises: {
            create: validatedData.exercises?.map((ex) => ({
              name: ex.name,
              sets: ex.sets || null,
              reps: ex.reps || null,
              weight: ex.weight || null,
              duration: ex.duration || null,
            })) || [],
          },
        },
        include: { exercises: true },
      })
      return NextResponse.json({ success: true, message: "Workout logged", data: dbWorkout })
    }

    const res = await WorkoutService.addWorkout(validatedData)
    return NextResponse.json(res)
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, message: "Validation failed", errors: (err as any).errors.map((e: any) => e.message) },
        { status: 400 }
      )
    }
    return NextResponse.json({ success: false, message: err.message }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")
    if (!id) {
      return NextResponse.json({ success: false, message: "ID parameter is required" }, { status: 400 })
    }

    if (process.env.DATABASE_URL) {
      await prisma.workout.delete({
        where: { id },
      })
      return NextResponse.json({ success: true, message: "Workout deleted" })
    }

    const res = await WorkoutService.deleteWorkout(id)
    return NextResponse.json(res)
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 })
  }
}
