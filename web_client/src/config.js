const DEVELOPMENT = false;
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
	    postLocation:(secure?"https":"http")+( DEVELOPMENT ? '://localhost:8000/posts/' : '://memechampion.com/images/posts/'),
        profileLocation:(secure?"https":"http")+( DEVELOPMENT ? '://localhost:8000/profiles/' : '://memechampion.com/images/profiles/')
    },
}
export default configs;
