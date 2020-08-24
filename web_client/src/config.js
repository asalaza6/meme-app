const DEVELOPMENT = false;
export const DEVELOPMENT2 = true;
const configs = {
    api: {
        url: DEVELOPMENT ? 'localhost' : '3.129.253.168',
        port: 8080
    },
    images: {
        location:"http://3.129.253.168/images/"
    },
}
export default configs;
