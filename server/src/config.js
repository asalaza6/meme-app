const DEVELOPMENT = false;

const configs = {
    dev: DEVELOPMENT,
    images: {
        location:DEVELOPMENT?"src/images/":"/var/www/memechampion.com/images/"
    },
}

module.exports=configs;
