import { useState, useEffect } from 'react';
import api from '../api/api';

interface AuthorizedImageProps {
    imageId: number;
    accessToken: string;
    style?: React.CSSProperties;
}

const AuthorizedImage = ({ imageId, accessToken, style }: AuthorizedImageProps) => {
    const [imgSrc, setImgSrc] = useState<string>('');

    useEffect(() => {
        const fetchImage = async () => {
            try {
                const response = await api.get(`/admin/images/${imageId}`, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                    },
                    responseType: 'blob', // 데이터를 binary(blob) 형태로 받음
                });

                // 받아온 blob 데이터를 URL로 변환
                const url = URL.createObjectURL(response.data);
                setImgSrc(url);
            } catch (error) {
                console.error('이미지 로드 실패:', error);
            }
        };

        if (imageId && accessToken) {
            fetchImage();
        }

        // 컴포넌트가 언마운트될 때 메모리 해제 (중요!)
        return () => {
            if (imgSrc) URL.revokeObjectURL(imgSrc);
        };
    }, [imageId, accessToken]);

    return imgSrc ? <img src={imgSrc} style={style} alt="admin-check" /> : <span>Loading...</span>;
};

export default AuthorizedImage;