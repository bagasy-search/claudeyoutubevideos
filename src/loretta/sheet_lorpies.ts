// Datos de la lámina "Loretta's Recipe Card" de lorpies (los 7 pies). Van en código: cero typos.
import type { SheetPie } from "./LorRecipeCard";
export const SHEET_LORPIES: SheetPie[] = [
  { name: "Chess Pie", oven: "Unbaked crust · 350°F · 45–50 min", lines: ["1 stick butter, melted", "1 ½ cups sugar", "1 Tbsp cornmeal · 1 Tbsp flour", "4 eggs · ¼ cup milk", "1 Tbsp vinegar · 1 tsp vanilla"], trick: "stir, don't beat. Cool 3 hours." },
  { name: "Sugar Cream Pie", oven: "Unbaked crust · 400°F 10 min, then 350°F ~45", lines: ["1 cup sugar · ¼ cup flour", "pinch of salt", "2 cups heavy cream", "1 tsp vanilla · 2 Tbsp butter", "nutmeg on top · no eggs"], trick: "stir it in the crust with a finger." },
  { name: "Shoofly Pie", oven: "Unbaked crust · 400°F 10 min, then 350°F ~30", lines: ["Crumbs: 1 cup flour,", "⅔ cup brown sugar, 4 Tbsp butter", "1 cup light molasses · 1 egg", "¾ cup boiling water", "1 tsp baking soda"], trick: "dissolve the soda first. Never blackstrap." },
  { name: "Butterscotch Pie", oven: "Baked crust · stovetop filling", lines: ["1 cup dark brown sugar", "4 Tbsp butter", "2 ½ cups whole milk", "3 Tbsp cornstarch · 3 yolks", "¼ tsp salt · 1 tsp vanilla"], trick: "cook the sugar darker. Warm the milk." },
  { name: "Lemon Meringue", oven: "Baked crust · meringue 350°F 12–15 min", lines: ["1 cup sugar · ⅓ cup cornstarch", "1 ½ cups water · 4 yolks", "½ cup lemon juice + peel", "2 Tbsp butter", "Meringue: 4 whites, ½ cup sugar"], trick: "juice goes in last. Meringue on HOT filling." },
  { name: "Sour Cream Raisin", oven: "Baked crust · meringue 350°F ~12 min", lines: ["1 cup raisins", "1 cup sour cream · 1 cup milk", "¾ cup sugar · 3 Tbsp cornstarch", "3 yolks · 1 tsp cinnamon", "1 tsp vanilla"], trick: "simmer the raisins 5 minutes first." },
  { name: "Mock Apple Pie", oven: "Two crusts · 425°F · 30–35 min", lines: ["36 round butter crackers", "2 cups water · 2 cups sugar", "2 tsp cream of tartar", "2 Tbsp lemon juice + peel", "2 Tbsp butter · ½ tsp cinnamon"], trick: "break, don't crush. Pour the syrup COOL." },
];
// zoom punto por punto: [segundo, cx, cy, escala]
export const SHEET_KEYS: [number, number, number, number][] = [
  [0, 0.5, 0.5, 1], [2.5, 0.5, 0.5, 1], [3.5, 0.16, 0.34, 2.1], [6.5, 0.39, 0.34, 2.1], [9.5, 0.62, 0.34, 2.1], [12.5, 0.85, 0.34, 2.1],
  [15.5, 0.16, 0.74, 2.1], [18.5, 0.39, 0.74, 2.1], [21.5, 0.62, 0.74, 2.1], [24, 0.5, 0.5, 1],
];
