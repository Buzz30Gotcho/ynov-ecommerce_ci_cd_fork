require('dotenv').config();

const featureFlags = {
    productsV2: process.env.FEATURE_V2_PRODUCTS === 'true',
    ordersStatusV2: process.env.FEATURE_ORDERS_STATUS_V2 === 'true',
    usersRoleSystem: process.env.FEATURE_USERS_ROLE_SYSTEM === 'true',
};

module.exports = featureFlags;





