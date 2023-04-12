db = db.getSiblingDB('cars');
db.createUser(
    {
        user: "testuser",
        pwd: "passtest",
        roles: [
            {
                role: "readWrite",
                db: "cars"
            }
        ]
    }
);
db.createCollection('cars');