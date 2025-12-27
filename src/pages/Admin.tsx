import { useState, type ChangeEvent } from 'react';
import api from '../api/api';

interface ImageResponse {
    id: number;
    name: string;
    createdAt: string;
}

function Admin() {

    const [adminSecretKey, setAdminSecretKey] = useState<string>("");

    const [notConfirmedImages, setNotConfirmedImages] = useState<ImageResponse[]>([]);

    const handleAdminSecretKeyChange = (e: ChangeEvent<HTMLInputElement>) => {
        setAdminSecretKey(e.target.value);
    }

    const getNotConfirmedImages = async () => {
        try {
            const response = await api.get('/admin/images?confirmed=false', {
                headers: {
                    'Admin-Secret-Key': adminSecretKey,
                },
            });
            setNotConfirmedImages(response.data.images);
            console.log('Not confirmed images:', response.data.images);
        } catch (error) {
            console.error('Error fetching not confirmed images:', error);
        }
    }

    const confirmImage = async (imageId: number) => {
        try {
            await api.post(`/admin/images/${imageId}/confirmation`, {imageId}, {
                headers: {
                    'Admin-Secret-Key': adminSecretKey,
                },
            });
            alert('이미지 컨펌 성공!');
        } catch (error) {
            console.error('Error confirming image:', error);
        }
    }

    return (
        <div>
            <div>
                <p>관리자 비밀 키</p>
                <input type="password" value={adminSecretKey} onChange={handleAdminSecretKeyChange} placeholder='관리자 비밀 키를 입력하세요' />
            </div>
            <div style={{"display": "flex"}}>
                <p>컨펌 안된 이미지들</p>
                <button onClick={getNotConfirmedImages}>조회</button>
            </div>
            <div style={{"display": "block"}}>
                <ul style={{ marginTop: '20px', listStyle: 'none', padding: 0 }}>
                    {notConfirmedImages.map((image) => (
                        <li key={image.id} style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '15px',
                            marginBottom: '10px',
                            borderBottom: '1px solid #eee',
                            paddingBottom: '5px'
                        }}>
                            <span><strong>ID:</strong> {image.id}</span>
                            <span><strong>파일명:</strong> {image.name}</span>
                            <span><strong>생성일:</strong> {image.createdAt}</span>
                            <button onClick={() => confirmImage(image.id)}>컨펌</button>
                        </li>
                    ))}
                </ul>

                {notConfirmedImages.length === 0 && (<p>표시할 데이터가 없습니다.</p>)}
            </div>
        </div>
    )
}

export default Admin