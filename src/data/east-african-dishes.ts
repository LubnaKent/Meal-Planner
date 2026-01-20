// East African Dishes Database
// Includes dishes from Uganda, Kenya, Tanzania, Rwanda, and Burundi
// With translations in English, Swahili (Kiswahili), and Luganda

export interface EastAfricanDish {
  id: string
  name: {
    en: string
    sw: string // Swahili
    lg: string // Luganda
  }
  description: {
    en: string
    sw: string
    lg: string
  }
  country: 'Uganda' | 'Kenya' | 'Tanzania' | 'Rwanda' | 'Burundi'
  calories: number
  protein: number
  carbs: number
  fats: number
  fiber: number
  benefits: string[]
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack'
  prepTime: number // minutes
  ingredients: string[]
  isVegetarian: boolean
  isVegan: boolean
}

export const eastAfricanDishes: EastAfricanDish[] = [
  // ============ UGANDAN DISHES ============
  {
    id: 'ug-matooke',
    name: {
      en: 'Matooke (Steamed Green Bananas)',
      sw: 'Ndizi za Kupika',
      lg: 'Matooke'
    },
    description: {
      en: 'Steamed and mashed green bananas, a Ugandan staple food',
      sw: 'Ndizi za kijani zilizopikwa kwa mvuke na kupondwa',
      lg: 'Matooke agafumbirwa ne gatekebwa'
    },
    country: 'Uganda',
    calories: 220,
    protein: 2,
    carbs: 55,
    fats: 0.5,
    fiber: 4,
    benefits: ['High in potassium', 'Good for digestion', 'Energy boosting'],
    mealType: 'lunch',
    prepTime: 45,
    ingredients: ['Green bananas', 'Banana leaves', 'Salt'],
    isVegetarian: true,
    isVegan: true
  },
  {
    id: 'ug-rolex',
    name: {
      en: 'Rolex (Rolled Eggs)',
      sw: 'Rolex',
      lg: 'Rolex'
    },
    description: {
      en: 'Chapati rolled with eggs and vegetables, popular Ugandan street food',
      sw: 'Chapati iliyozungushwa na mayai na mboga',
      lg: 'Chapati ezingiriddwamu amagi ne nva'
    },
    country: 'Uganda',
    calories: 380,
    protein: 14,
    carbs: 42,
    fats: 18,
    fiber: 3,
    benefits: ['High protein', 'Quick energy', 'Filling meal'],
    mealType: 'breakfast',
    prepTime: 15,
    ingredients: ['Chapati', 'Eggs', 'Tomatoes', 'Onions', 'Cabbage', 'Oil'],
    isVegetarian: true,
    isVegan: false
  },
  {
    id: 'ug-luwombo',
    name: {
      en: 'Luwombo (Steamed Meat in Banana Leaves)',
      sw: 'Nyama Iliyofungwa kwa Majani ya Ndizi',
      lg: 'Luwombo'
    },
    description: {
      en: 'Meat, chicken or fish steamed in banana leaves with groundnut sauce',
      sw: 'Nyama, kuku au samaki iliyopikwa kwa mvuke katika majani ya ndizi na mchuzi wa karanga',
      lg: 'Ennyama, enkoko oba ekyenyanja ekifumbiriddwa mu bikoola by\'ebitooke ne binyeebwa'
    },
    country: 'Uganda',
    calories: 450,
    protein: 35,
    carbs: 15,
    fats: 28,
    fiber: 2,
    benefits: ['High protein', 'Rich in healthy fats', 'Traditional nutrients'],
    mealType: 'dinner',
    prepTime: 90,
    ingredients: ['Chicken/Beef', 'Groundnut paste', 'Banana leaves', 'Tomatoes', 'Onions'],
    isVegetarian: false,
    isVegan: false
  },
  {
    id: 'ug-katogo',
    name: {
      en: 'Katogo (Mixed Breakfast)',
      sw: 'Katogo',
      lg: 'Katogo'
    },
    description: {
      en: 'Green bananas cooked with beans, groundnuts, or meat',
      sw: 'Ndizi za kijani zilizopikwa na maharagwe, karanga, au nyama',
      lg: 'Matooke agatekedwa n\'ebijanjaalo, ebinyeebwa, oba ennyama'
    },
    country: 'Uganda',
    calories: 320,
    protein: 12,
    carbs: 48,
    fats: 10,
    fiber: 8,
    benefits: ['High fiber', 'Balanced meal', 'Sustained energy'],
    mealType: 'breakfast',
    prepTime: 40,
    ingredients: ['Green bananas', 'Beans', 'Onions', 'Tomatoes', 'Salt'],
    isVegetarian: true,
    isVegan: true
  },
  {
    id: 'ug-posho',
    name: {
      en: 'Posho (Maize Meal)',
      sw: 'Ugali',
      lg: 'Posho/Kawunga'
    },
    description: {
      en: 'Thick maize flour porridge, served with beans or sauce',
      sw: 'Uji mzito wa unga wa mahindi, huliwa na maharagwe au mchuzi',
      lg: 'Kawunga oba posho, kulya n\'ebijanjaalo oba supu'
    },
    country: 'Uganda',
    calories: 180,
    protein: 4,
    carbs: 40,
    fats: 1,
    fiber: 2,
    benefits: ['Energy rich', 'Filling', 'Affordable'],
    mealType: 'lunch',
    prepTime: 20,
    ingredients: ['Maize flour', 'Water', 'Salt'],
    isVegetarian: true,
    isVegan: true
  },
  {
    id: 'ug-groundnut-sauce',
    name: {
      en: 'Groundnut Sauce (G-Nut Sauce)',
      sw: 'Mchuzi wa Karanga',
      lg: 'Ebinyeebwa'
    },
    description: {
      en: 'Rich peanut-based sauce served with rice or matooke',
      sw: 'Mchuzi tajiri wa karanga huliwa na wali au ndizi',
      lg: 'Suupu y\'ebinyeebwa ekulya ne matooke oba omuceere'
    },
    country: 'Uganda',
    calories: 280,
    protein: 10,
    carbs: 12,
    fats: 22,
    fiber: 3,
    benefits: ['High protein', 'Healthy fats', 'Rich in vitamins'],
    mealType: 'lunch',
    prepTime: 30,
    ingredients: ['Groundnuts', 'Tomatoes', 'Onions', 'Salt'],
    isVegetarian: true,
    isVegan: true
  },

  // ============ KENYAN DISHES ============
  {
    id: 'ke-ugali',
    name: {
      en: 'Ugali',
      sw: 'Ugali',
      lg: 'Kawunga'
    },
    description: {
      en: 'Kenyan staple made from maize flour, similar to posho',
      sw: 'Chakula kikuu cha Kenya kilichotengenezwa kwa unga wa mahindi',
      lg: 'Emmere enkulu ey\'e Kenya eteekebwa mu buwunga bwa kasooli'
    },
    country: 'Kenya',
    calories: 180,
    protein: 4,
    carbs: 40,
    fats: 1,
    fiber: 2,
    benefits: ['Energy source', 'Filling', 'Versatile'],
    mealType: 'lunch',
    prepTime: 20,
    ingredients: ['Maize flour', 'Water'],
    isVegetarian: true,
    isVegan: true
  },
  {
    id: 'ke-nyama-choma',
    name: {
      en: 'Nyama Choma (Grilled Meat)',
      sw: 'Nyama Choma',
      lg: 'Ennyama Enjokye'
    },
    description: {
      en: 'Grilled goat or beef, Kenya\'s beloved barbecue',
      sw: 'Nyama ya mbuzi au ng\'ombe iliyochomwa',
      lg: 'Ennyama y\'embuzi oba ente enjokeddwa ku muliro'
    },
    country: 'Kenya',
    calories: 350,
    protein: 40,
    carbs: 0,
    fats: 20,
    fiber: 0,
    benefits: ['High protein', 'Iron rich', 'Zinc source'],
    mealType: 'dinner',
    prepTime: 60,
    ingredients: ['Goat/Beef', 'Salt', 'Spices'],
    isVegetarian: false,
    isVegan: false
  },
  {
    id: 'ke-sukuma-wiki',
    name: {
      en: 'Sukuma Wiki (Collard Greens)',
      sw: 'Sukuma Wiki',
      lg: 'Sukuma Wiki'
    },
    description: {
      en: 'Sautéed collard greens with onions and tomatoes',
      sw: 'Sukuma wiki iliyokaangwa na vitunguu na nyanya',
      lg: 'Sukuma wiki ensigiddwa mu butungulu ne nyanya'
    },
    country: 'Kenya',
    calories: 80,
    protein: 4,
    carbs: 10,
    fats: 3,
    fiber: 5,
    benefits: ['High in vitamins', 'Low calorie', 'Rich in iron'],
    mealType: 'lunch',
    prepTime: 15,
    ingredients: ['Collard greens', 'Onions', 'Tomatoes', 'Oil', 'Salt'],
    isVegetarian: true,
    isVegan: true
  },
  {
    id: 'ke-githeri',
    name: {
      en: 'Githeri (Maize and Beans)',
      sw: 'Githeri',
      lg: 'Kasooli n\'Ebijanjaalo'
    },
    description: {
      en: 'Boiled maize and beans, nutritious Kenyan staple',
      sw: 'Mahindi na maharagwe yaliyochemshwa',
      lg: 'Kasooli n\'ebijanjaalo ebyokeddwa'
    },
    country: 'Kenya',
    calories: 250,
    protein: 12,
    carbs: 45,
    fats: 2,
    fiber: 10,
    benefits: ['High fiber', 'Complete protein', 'Heart healthy'],
    mealType: 'lunch',
    prepTime: 60,
    ingredients: ['Maize', 'Beans', 'Salt', 'Onions'],
    isVegetarian: true,
    isVegan: true
  },
  {
    id: 'ke-chapati',
    name: {
      en: 'Chapati',
      sw: 'Chapati',
      lg: 'Chapati'
    },
    description: {
      en: 'Layered flatbread, popular across East Africa',
      sw: 'Mkate laini wenye tabaka, maarufu Afrika Mashariki',
      lg: 'Omugaati omuweweevu, ogumanyiddwa mu buvanjuba bwa Afrika'
    },
    country: 'Kenya',
    calories: 250,
    protein: 6,
    carbs: 40,
    fats: 8,
    fiber: 2,
    benefits: ['Energy source', 'Filling', 'Versatile'],
    mealType: 'breakfast',
    prepTime: 30,
    ingredients: ['Flour', 'Water', 'Oil', 'Salt'],
    isVegetarian: true,
    isVegan: true
  },

  // ============ TANZANIAN DISHES ============
  {
    id: 'tz-pilau',
    name: {
      en: 'Pilau (Spiced Rice)',
      sw: 'Pilau',
      lg: 'Pilau'
    },
    description: {
      en: 'Aromatic spiced rice with meat, Tanzanian specialty',
      sw: 'Wali wenye viungo na nyama, chakula maalum cha Tanzania',
      lg: 'Omuceere oguteekedwamu ebyobuzungu n\'ennyama, emmere ey\'e Tanzania'
    },
    country: 'Tanzania',
    calories: 420,
    protein: 18,
    carbs: 55,
    fats: 15,
    fiber: 2,
    benefits: ['Complete meal', 'Aromatic spices', 'Energy rich'],
    mealType: 'dinner',
    prepTime: 60,
    ingredients: ['Rice', 'Beef/Chicken', 'Pilau spices', 'Onions', 'Garlic', 'Tomatoes'],
    isVegetarian: false,
    isVegan: false
  },
  {
    id: 'tz-mishkaki',
    name: {
      en: 'Mishkaki (Grilled Skewers)',
      sw: 'Mishkaki',
      lg: 'Mishkaki'
    },
    description: {
      en: 'Marinated meat skewers grilled over charcoal',
      sw: 'Nyama iliyotiwa mchuzi na kuchomwa kwa makaa',
      lg: 'Ennyama eteekedwa mu suupu ne yokebwa ku makala'
    },
    country: 'Tanzania',
    calories: 280,
    protein: 28,
    carbs: 5,
    fats: 16,
    fiber: 0,
    benefits: ['High protein', 'Low carb', 'Grilled goodness'],
    mealType: 'dinner',
    prepTime: 45,
    ingredients: ['Beef', 'Lemon', 'Spices', 'Oil'],
    isVegetarian: false,
    isVegan: false
  },
  {
    id: 'tz-chipsi-mayai',
    name: {
      en: 'Chipsi Mayai (Chips Omelette)',
      sw: 'Chipsi Mayai',
      lg: 'Chipsi Mayai'
    },
    description: {
      en: 'French fries mixed with beaten eggs, fried like an omelette',
      sw: 'Chipsi zilizochanganywa na mayai yaliyopigwa, kukaangwa kama omelette',
      lg: 'Chipsi ezitabiddwa mu magi, ne zisiigibwa ng\'omeleti'
    },
    country: 'Tanzania',
    calories: 480,
    protein: 15,
    carbs: 50,
    fats: 25,
    fiber: 3,
    benefits: ['Quick meal', 'Protein and carbs', 'Filling'],
    mealType: 'lunch',
    prepTime: 20,
    ingredients: ['Potatoes', 'Eggs', 'Oil', 'Salt'],
    isVegetarian: true,
    isVegan: false
  },
  {
    id: 'tz-wali-maharage',
    name: {
      en: 'Wali na Maharage (Rice and Beans)',
      sw: 'Wali na Maharage',
      lg: 'Omuceere n\'Ebijanjaalo'
    },
    description: {
      en: 'Rice served with coconut beans, coastal Tanzanian favorite',
      sw: 'Wali na maharagwe ya nazi, chakula kinachopendwa pwani',
      lg: 'Omuceere oguliiwa n\'ebijanjaalo eby\'omu nazi'
    },
    country: 'Tanzania',
    calories: 350,
    protein: 14,
    carbs: 60,
    fats: 6,
    fiber: 8,
    benefits: ['Complete protein', 'High fiber', 'Heart healthy'],
    mealType: 'lunch',
    prepTime: 45,
    ingredients: ['Rice', 'Beans', 'Coconut milk', 'Onions', 'Tomatoes'],
    isVegetarian: true,
    isVegan: true
  },

  // ============ RWANDAN DISHES ============
  {
    id: 'rw-isombe',
    name: {
      en: 'Isombe (Cassava Leaves)',
      sw: 'Isombe',
      lg: 'Isombe'
    },
    description: {
      en: 'Mashed cassava leaves cooked with eggplant and spinach',
      sw: 'Majani ya muhogo yaliyopondwa yakipikwa na biringani na mchicha',
      lg: 'Amakoola g\'emuwogo agatekeddwa ne biringanya ne nakati'
    },
    country: 'Rwanda',
    calories: 150,
    protein: 5,
    carbs: 20,
    fats: 6,
    fiber: 6,
    benefits: ['High fiber', 'Rich in vitamins', 'Low calorie'],
    mealType: 'lunch',
    prepTime: 60,
    ingredients: ['Cassava leaves', 'Eggplant', 'Palm oil', 'Onions', 'Salt'],
    isVegetarian: true,
    isVegan: true
  },
  {
    id: 'rw-brochettes',
    name: {
      en: 'Brochettes (Grilled Meat Skewers)',
      sw: 'Brochettes',
      lg: 'Brochettes'
    },
    description: {
      en: 'Grilled goat meat skewers, Rwanda\'s favorite street food',
      sw: 'Nyama ya mbuzi iliyochomwa kwenye vijiti',
      lg: 'Ennyama y\'embuzi enjokeddwa ku bisanda'
    },
    country: 'Rwanda',
    calories: 300,
    protein: 32,
    carbs: 2,
    fats: 18,
    fiber: 0,
    benefits: ['High protein', 'Iron rich', 'Low carb'],
    mealType: 'dinner',
    prepTime: 40,
    ingredients: ['Goat meat', 'Salt', 'Pepper', 'Lemon'],
    isVegetarian: false,
    isVegan: false
  },
  {
    id: 'rw-ubugali',
    name: {
      en: 'Ubugali (Cassava Paste)',
      sw: 'Ubugali',
      lg: 'Ubugali'
    },
    description: {
      en: 'Thick cassava flour paste, Rwandan staple food',
      sw: 'Uji mzito wa unga wa muhogo',
      lg: 'Kawunga w\'omuwogo'
    },
    country: 'Rwanda',
    calories: 190,
    protein: 2,
    carbs: 45,
    fats: 0.5,
    fiber: 2,
    benefits: ['Energy source', 'Gluten free', 'Filling'],
    mealType: 'lunch',
    prepTime: 25,
    ingredients: ['Cassava flour', 'Water'],
    isVegetarian: true,
    isVegan: true
  },

  // ============ BURUNDIAN DISHES ============
  {
    id: 'bi-beans-plantains',
    name: {
      en: 'Beans and Plantains',
      sw: 'Maharagwe na Ndizi',
      lg: 'Ebijanjaalo ne Gonja'
    },
    description: {
      en: 'Red beans cooked with ripe plantains, Burundian comfort food',
      sw: 'Maharagwe mekundu yaliyopikwa na ndizi mbivu',
      lg: 'Ebijanjaalo ebyekeddwa ne gonja enzirire'
    },
    country: 'Burundi',
    calories: 280,
    protein: 10,
    carbs: 52,
    fats: 3,
    fiber: 9,
    benefits: ['High fiber', 'Complete protein', 'Potassium rich'],
    mealType: 'lunch',
    prepTime: 50,
    ingredients: ['Red beans', 'Ripe plantains', 'Onions', 'Salt', 'Oil'],
    isVegetarian: true,
    isVegan: true
  },
  {
    id: 'bi-mukeke',
    name: {
      en: 'Mukeke (Grilled Tilapia)',
      sw: 'Mukeke',
      lg: 'Mukeke'
    },
    description: {
      en: 'Grilled tilapia fish from Lake Tanganyika',
      sw: 'Samaki wa sato aliyechomwa kutoka Ziwa Tanganyika',
      lg: 'Ekyenyanja Tilapia ekyokeddwa okuva mu nnyanja Tanganyika'
    },
    country: 'Burundi',
    calories: 200,
    protein: 35,
    carbs: 0,
    fats: 6,
    fiber: 0,
    benefits: ['High protein', 'Omega-3', 'Low fat'],
    mealType: 'dinner',
    prepTime: 30,
    ingredients: ['Tilapia fish', 'Lemon', 'Salt', 'Pepper'],
    isVegetarian: false,
    isVegan: false
  },
  {
    id: 'bi-igisafuria',
    name: {
      en: 'Igisafuria (One-Pot Meal)',
      sw: 'Igisafuria',
      lg: 'Igisafuria'
    },
    description: {
      en: 'Mixed vegetables and meat cooked together in one pot',
      sw: 'Mboga mchanganyiko na nyama zilizopikwa pamoja kwenye sufuria moja',
      lg: 'Enva ezitabiddwa n\'ennyama mu ssefuliya emu'
    },
    country: 'Burundi',
    calories: 320,
    protein: 18,
    carbs: 35,
    fats: 12,
    fiber: 6,
    benefits: ['Balanced meal', 'Nutrient dense', 'Easy to make'],
    mealType: 'dinner',
    prepTime: 45,
    ingredients: ['Beef', 'Potatoes', 'Carrots', 'Cabbage', 'Onions', 'Tomatoes'],
    isVegetarian: false,
    isVegan: false
  }
]

// Helper functions
export const getDishesByCountry = (country: string) =>
  eastAfricanDishes.filter(dish => dish.country === country)

export const getVegetarianDishes = () =>
  eastAfricanDishes.filter(dish => dish.isVegetarian)

export const getVeganDishes = () =>
  eastAfricanDishes.filter(dish => dish.isVegan)

export const getDishesByMealType = (mealType: string) =>
  eastAfricanDishes.filter(dish => dish.mealType === mealType)

export const getQuickMeals = (maxMinutes: number = 30) =>
  eastAfricanDishes.filter(dish => dish.prepTime <= maxMinutes)

export const getLowCalorieDishes = (maxCalories: number = 300) =>
  eastAfricanDishes.filter(dish => dish.calories <= maxCalories)

export const getHighProteinDishes = (minProtein: number = 20) =>
  eastAfricanDishes.filter(dish => dish.protein >= minProtein)
