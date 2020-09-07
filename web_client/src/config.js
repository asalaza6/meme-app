const DEVELOPMENT = false;
export const DEVELOPMENT2 = true;
const secure = false;
const configs = {
    api: {
	    url: DEVELOPMENT ? 'localhost' : (secure?"https":"http")+'://18.222.107.185',
        port: 8080
    },
    images: {
	    location:(secure?"https":"http")+"://memechampion.com/images/"
    },
}
export default configs;
