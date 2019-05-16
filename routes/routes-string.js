const api = {
    parent:'/api',
    user: {
        register: "/register",
        login: "/login"
    },
    event: {
        create: "/create",
        root: '/',
        get: {
            all: "/",
            id: "/:id"
        }
    }
};

const WEB = {

};


module.exports = {
    api,
    ...WEB
};
