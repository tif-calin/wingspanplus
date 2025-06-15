
const FoodEnum = ['fish', 'fruit', 'invertebrate', 'nectar', 'no-food', 'rodent', 'seed', 'wild', ] as const;
type FoodEnum = (typeof FoodEnum)[number];
const PowerTagEnum = ['bonus-card', 'flocking', 'predator', ] as const;
type PowerTagEnum = (typeof PowerTagEnum)[number];
const NestEnum = ['bowl', 'cavity', 'ground', 'platform', 'star', ] as const;
type NestEnum = (typeof NestEnum)[number];
const HabitatEnum = ['forest', 'grassland', 'wetland', ] as const;
type HabitatEnum = (typeof HabitatEnum)[number];

const InlineTextEnum = ['card', 'dice', 'egg', ] as const;
type InlineTextEnum = (typeof InlineTextEnum)[number];
const UiEnum = ['smallegg', 'point', 'wingspan', ] as const;
type UiEnum = (typeof UiEnum)[number];

export type { FoodEnum, PowerTagEnum, NestEnum, HabitatEnum, InlineTextEnum, UiEnum };
