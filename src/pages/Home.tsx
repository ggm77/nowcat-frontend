import { useEffect, useState, type ChangeEvent } from 'react';
import api from '../api/api';

function Home() {

    const [mainImageUrl, setMainImageUrl] = useState<string>("");
    const [mainImageLoaded, setMainImageLoaded] = useState<boolean>(false);

    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    useEffect(() => {
        const fetchMainImage = async () => {
            try {
                setMainImageLoaded(false);
                const response = await api.get('/images/main');
                console.log('Main image data:', response.data);
                setMainImageUrl(response.data.url);
            } catch (error) {
                console.error('Error fetching main image:', error);
            }
        }

        fetchMainImage();
    }, []);

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const allowdTypes = ['image/jpeg', 'image/jpg', 'image/png'];

            if(!allowdTypes.includes(file.type)) {
                alert('지원하지 않는 파일 형식입니다. jpg, jpeg, png 파일만 업로드 가능합니다.');
                e.target.value = '';
                return;
            }

            setSelectedFile(file);
        }
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            alert('업로드할 파일을 선택해주세요.');
            return;
        }

        const formData = new FormData();
        formData.append('file', selectedFile);

        try {
            await api.post('/images', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            alert('이미지 업로드 성공!');

        } catch (error) {
            console.error('Error uploading image:', error);
            alert('이미지 업로드 실패');
        }
    };

    return (
        <div>
            <div>
                {!mainImageLoaded && (
                    <p>Loading main image...</p>
                )}
                <img src={mainImageUrl} alt="Main" onLoad={() => setMainImageLoaded(true)} style={{display: mainImageLoaded ? 'block' : 'none'}}/>
            </div>
            
            <hr/>

            <div>
                <p>이미지 업로드</p>
                <p>관리자 확인 후 이미지가 표시됩니다.</p>
                <input
                    type="file"
                    accept=".jpg,.jpeg,.png"
                    onChange={handleFileChange}
                />
                <button onClick={handleUpload}>업로드</button>
            </div>
        </div>
    )
}

export default Home