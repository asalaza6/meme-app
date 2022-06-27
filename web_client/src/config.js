const DEVELOPMENT = false;
const secure = false;
/*
development mode for images 
run 
python3 -m http.server 8000 on the server/src/images folder
*/
const configs = {
    api: {
	    url:(secure?"https":"http")+( DEVELOPMENT ? '://localhost' : '://ec2-34-209-212-2.us-west-2.compute.amazonaws.com'),
        port: secure?8081:8080
    },
    images: {
	    postLocation:(secure?"https":"http")+( DEVELOPMENT ? '://localhost:8000/posts/' : '://ec2-34-209-212-2.us-west-2.compute.amazonaws.com/images/posts/'),
        profileLocation:(secure?"https":"http")+( DEVELOPMENT ? '://localhost:8000/profiles/' : '://ec2-34-209-212-2.us-west-2.compute.amazonaws.com/images/profiles/')
    },
}
export default configs;
