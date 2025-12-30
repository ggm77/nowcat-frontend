import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/api';
import AuthorizedImage from '../../components/AuthorizedImage';

interface ImageResponse {
    id: number;
    name: string;
    createdAt: string;
}

function Admin() {

    const [accessToken, setAccessToken] = useState<string>(localStorage.getItem('accessToken') || '');
    const [notConfirmedImages, setNotConfirmedImages] = useState<ImageResponse[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        if(!accessToken || accessToken === '') {
            navigate('/', { replace: true });
        }
    }, [accessToken, navigate]);

    const getNotConfirmedImages = async () => {
        try {
            if(!accessToken || accessToken === '') {
                alert('관리자 로그인이 필요합니다.');
                return;
            }

            const response = await api.get('/admin/images?confirmed=false', {
                headers: {
                    'Authorization': 'Bearer ' + accessToken,
                },
            });
            setNotConfirmedImages(response.data.images);
            console.log('Not confirmed images:', response.data.images);
        } catch (error) {

            const err = error as any;

            if(err.response && err.response.status === 403) {
                alert('관리자 인증에 실패했습니다. 다시 로그인해주세요.');
                navigate('/admin/login', { replace: true });
                return;
            }

            console.error('Error fetching not confirmed images:', error);
        }
    }

    const confirmImage = async (imageId: number) => {
        try {

            if(!accessToken || accessToken === '') {
                alert('관리자 로그인이 필요합니다.');
                return;
            }

            await api.patch(`/admin/images/${imageId}/confirmation`, {isConfirmed: true}, {
                headers: {
                    'Authorization': 'Bearer ' + accessToken,
                },
            });
            alert('이미지 컨펌 성공!');
        } catch (error) {
            console.error('Error confirming image:', error);
        }
    }

    const handleLogout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        setAccessToken('');
        alert('로그아웃 되었습니다.');
        navigate('/admin/login', { replace: false });
    }

    return (
        <div style={{ "color": "#fff"}}>
            <div style={{"display": "flex" }}>
                <button onClick={handleLogout}>로그아웃</button>
                <a href='/'>홈</a>
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
                            <span><AuthorizedImage
                                imageId={image.id}
                                accessToken={accessToken}
                                style={{ width: '25px', height: '25px'}}
                            /></span>
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