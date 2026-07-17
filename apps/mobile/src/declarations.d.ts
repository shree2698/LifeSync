declare module "*.css" {
  const content: { [className: string]: string } | any;
  export default content;
}

declare module "*.png" {
  const value: any;
  export default value;
}
