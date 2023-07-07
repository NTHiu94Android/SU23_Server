
//const domain = 'http://localhost:3000';
const domain = 'https://itech-server-datn.onrender.com';


const fetchApi = async (url, option) => {
    const res = await fetch(url, option);
    return res.json();
}

const edit = (_id) => {
    window.location.href = `${domain}/products/${_id}/product-update`
}

const editCategory = (id) => {
    window.location.href = `${domain}/categories/${id}/update`;
}

const deleteCategory = (id) => {
    swal({
        title: "Are you sure?",
        text: "Once deleted, you will not be able to recover this imaginary file!",
        icon: "warning",
        buttons: true,
        dangerMode: true,
    })
        .then(async (willDelete) => {
            if (willDelete) {
                let url = `/categories/${id}/delete`;
                let option = {
                    method: 'GET'
                }
                let result = await fetchApi(url, option);
                if (result.status) {
                    swal('Delete category successfully', {
                        icon: 'success'
                    });
                    setTimeout(() => {
                        window.location.reload();
                    }, 1000);
                } else {
                    swal('Delete failure', {
                        icon: 'error'
                    });
                }
            } else {
                swal("Your imaginary file is safe!");
            }
        });
}

const editBrand = (id) => {
    window.location.href = `${domain}/brands/${id}/update`;
}

const deleteBrand = (id) => {
    swal({
        title: "Are you sure?",
        text: "Once deleted, you will not be able to recover this imaginary file!",
        icon: "warning",
        buttons: true,
        dangerMode: true,
    })
        .then(async (willDelete) => {
            if (willDelete) {
                let url = `/brands/${id}/delete`;
                let option = {
                    method: 'GET'
                }
                let result = await fetchApi(url, option);
                if (result.status) {
                    swal('Delete brand successfully', {
                        icon: 'success'
                    });
                    setTimeout(() => {
                        window.location.reload();
                    }, 1000);
                } else {
                    swal('Delete failure', {
                        icon: 'error'
                    });
                }
            } else {
                swal("Your imaginary file is safe!");
            }
        });
}

const editSubProduct = (_id) => {
    window.location.href = `${domain}/sub-products/${_id}/sub-product-update`
}

const addPicture = (_id) => {
    window.location.href = `${domain}/sub-products/${_id}/add-picture`
}

const handleDelivered = async (_idOrder) => {
    //Them hieu ung loading cho button
    const button = document.getElementById('btn-delivered');
    button.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Loading...`;
    button.disabled = true;
    
    const url = `${domain}/orders/${_idOrder}/update`;
    await fetch(url);
    setTimeout(() => {
        window.location.reload();
    }, 1000);

}

const handleCancel = async (_idOrder) => {
    //Them hieu ung loading cho button
    const button = document.getElementById('btn-cancel');
    button.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Loading...`;
    button.disabled = true;
    
    const url = `${domain}/orders/${_idOrder}/cancel`;
    await fetch(url);
    setTimeout(() => {
        window.location.reload();
    }, 1000);

}

const onChangeFile = () => {
    const file = document.getElementById('image-file').files[0];
    const reader = new FileReader();
    reader.onload = e => {
        document.getElementById('image-view').src = e.target.result;
        document.getElementById('image-view').style.display = 'block';
    }
    reader.readAsDataURL(file);
}

const onChangeFiles = () => {
    const files = document.getElementById('image-file').files;
    const imageContainer = document.getElementById('image-container');

    // Xóa hết các hình ảnh hiện tại trong container
    imageContainer.innerHTML = '';

    // Lặp qua từng tệp được chọn
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const reader = new FileReader();
        reader.onload = e => {
            const image = document.createElement('img');
            image.className = 'image-view';
            image.width = 200;
            image.height = 200;
            image.src = e.target.result;
            imageContainer.appendChild(image);
            image.style.display = 'block';
        };
        reader.readAsDataURL(file);
    }
};

// const handleDelivered = (_id) => {
//     fetch(`${domain}/orders/${_id}/order-detail`, {
//         method: 'POST',
//         headers: {
//         'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({status: 'Delivered'})
//     })
//     .then(res => res.json())
//     .then(res => {
//         if (res.status === 'success') {
//         alert('Xác nhận đơn hàng thành công');
//         window.location.href = 'http://localhost:3000/orders';
//         }
//     })
//     .catch(err => console.log(err));
// }