const DEVELOPMENT = true;
export const DEVELOPMENT2 = true;
const configs = {
    api: {
        url: DEVELOPMENT ? 'localhost' : '13.59.203.210',
        port: 8080
    },
    images: {
        location:"http://localhost:8081/"
    },
}
export default configs;
