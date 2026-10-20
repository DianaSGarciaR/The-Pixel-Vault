const BASE_URL = "http://localhost:8080/api/contactSupport";
export const createContactSupport = async function(contactSupportObject){
    try{
        const response = await fetch(`${BASE_URL}`,{
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(contactSupportObject),
        });
        if(!response.ok)
            throw Error("Error al crear el mensaje a soporte: ", response.status);
        const data = await response.json();
        console.log(data);
        return data;
    }
    catch(error){
        console.error("Fallo en la peticion: ", error.message);
    }
};