const deleteProduct=(btn)=>{
    const btnId = btn.id;
    const productId = btnId.split("#")[0];
    const csrf = btnId.split("#")[1];
    const productElement = btn.closest(".thumbnail");
    fetch("/admin/product/"+productId,{
        method:"DELETE",
        headers:{
            "csrf-token":csrf
        }
    }).then(result=>{
        console.log(result);
        return result.json() ;
    })
    .then(data=>{
        productElement.parentNode.removeChild(productElement);
    })
    .catch(err=>{
        console.log(err);
    });
}