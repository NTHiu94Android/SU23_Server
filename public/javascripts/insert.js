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
    };
    reader.readAsDataURL(file);
  }
};