const getBase64Image = (file) =>
  new Promise((resolve, reject) => {
    if (!['image/jpeg', 'image/jpg', 'image/png'].includes(file.type)) {
      reject({ ok: false, message: 'файл не изображение' });
    }
    if (file.size > 5 * 1024 * 1024) {
      reject({ ok: false, message: 'Слишком большой файл' });
    }
    const reader = new FileReader();

    reader.onloadend = () => {
      resolve(reader.result);
    };
    reader.readAsDataURL(file);
  });

export default getBase64Image;
