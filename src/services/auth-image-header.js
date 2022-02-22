export default function authImageHeader() {
    const user = JSON.parse(localStorage.getItem('user'));

    if (user && user.accessToken) {
        return {  
            'Access-Control-Allow-Origin' : '*',
            'Access-Control-Allow-Methods':'GET,PUT,POST,DELETE,PATCH,OPTIONS', 
            Authorization: 'Bearer ' + user.accessToken,
            'content-type' : 'multipart/form-data',
        };
    } else {
        return {};
    }
}