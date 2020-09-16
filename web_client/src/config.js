const DEVELOPMENT = false;
export const DEVELOPMENT2 = true;
const secure = true;
const configs = {
    api: {
	    url: DEVELOPMENT ? 'localhost' : (secure?"https":"http")+'://memechampion.com',
        port: secure?8081:8080
    },
    images: {
	    location:(secure?"https":"http")+"://memechampion.com/images/"
    },
}
export default configs;
