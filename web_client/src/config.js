const DEVELOPMENT = true;
export const DEVELOPMENT2 = true;
const secure = DEVELOPMENT?false:true;
/*
development mode for images 
run 
python3 -m http.server 8000 on the server/src/images folder
*/
const configs = {
    api: {
	    url:(secure?"https":"http")+( DEVELOPMENT ? '://localhost' : '://memechampion.com'),
        port: secure?8081:8080
    },
    images: {
	    location:(secure?"https":"http")+( DEVELOPMENT ? '://localhost:8000/' : '://memechampion.com/images/'),
    },
}
export default configs;
