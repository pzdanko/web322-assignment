//this file was the old fake database and is now obsolete
const meals = {
    mealsDB: [],
    perksDB: [],

    initDB() {
        this.mealsDB.push({
            title: "Valhalla Burger",
            description: "The Valhalla Feast Classic",
            price: "12.99",
            featured: true,
            imgCode: "valhallaBurger.jpg"

        });
        this.mealsDB.push({
            title: "Valhalla Fries",
            description: "The perfect companion to any feast",
            price: "4.99",
            featured: false,
            imgCode: "valhallaFries.jpg"

        });

        this.mealsDB.push({
            title: "The Mjölnir Burger",
            description: "A true test of worthiness",
            price: "14.99",
            featured: true,
            imgCode: "mjolnirBurger.jpg"

        });

        this.mealsDB.push({
            title: "Loki's Poutine",
            description: "A decievingly tasty meal",
            price: "13.99",
            featured: false,
            imgCode: "lokiPoutine.jpg"

        });

        this.mealsDB.push({
            title: "The Steak of Odin",
            description: "A steak worth losing an eye over",
            price: "32.99",
            featured: false,
            imgCode: "odinSteak.jpg"

        });

        this.mealsDB.push({
            title: "Ragnarök Curry",
            description: "A curry guaranteed to make your world go up in flames",
            price: "16.99",
            featured: true,
            imgCode: "ragnarokCurry.jpg"

        });

        this.mealsDB.push({
            title: "Valkyrie Chicken Wings",
            description: "Delivered straight from the Halls of Valhalla",
            price: "15.99",
            featured: true,
            imgCode: "valkyrieChickenWings.jpg"

        });

        this.mealsDB.push({
            title: "Hel's Ice Cream Sundae",
            description: "From the depth's of Niflheim, comes the best ice cream in the nine realms",
            price: "7.99",
            featured: false,
            imgCode: "helSundae.jpg"

        });

        this.perksDB.push({
            imgCode: "local.jpg",
            perk: "Locally Sourced"
        });

        this.perksDB.push({
            imgCode: "raised.jpg",
            perk: "Viking Raised"
        });

        this.perksDB.push({
            imgCode: "best.jpg",
            perk: "Farm Fresh"
        });
    },
    getAllMeals() {
        return this.mealsDB;
    },
    getTopMeals() {
        return this.mealsDB.filter(meal => meal.featured === true);
    },
    getAllPerks() {
        return this.perksDB;
    }
}





meals.initDB();

module.exports = meals;