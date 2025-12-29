import { useEffect, useState, type ChangeEvent } from 'react';
import api from '../api/api';
import './Home.css';

function Home() {

    const highlightPhrases = [
        "방금 도착한 인사",
        "반가운 눈맞춤",
        "오늘의 묘생샷",
        "깜짝 손님 냥이"
    ];
    const challengerTextPhrases = [
        "당신의 최고의 사진으로 이 자리를 빼앗아보세요. 경쟁은 시작되었습니다.",
        "지금 이 자리에 어울리는 당신의 베스트 샷을 기다립니다.",
        "오늘의 베스트 샷, 지금 바로 등록해 보세요.",
        "당신의 기록으로 완성되는 우리들의 공간."
    ]

    const [mainImageUrl, setMainImageUrl] = useState<string>("");
    const [mainImageLoaded, setMainImageLoaded] = useState<boolean>(false);
    const [isUploading, setIsUploading] = useState<boolean>(false);

    const getRandomPhrase = (phrases: string[]): string => {
        const randomIndex = Math.floor(Math.random() * phrases.length);
        return phrases[randomIndex];
    }

    const [currentHighlightPhrase] = useState<string>(() => getRandomPhrase(highlightPhrases));
    const [currentChallengerTextPhrase] = useState<string>(() => getRandomPhrase(challengerTextPhrases));

    useEffect(() => {

        if ('scrollRestoration' in window.history) {
            window.history.scrollRestoration = 'manual';
        }

        window.scrollTo(0, 0);

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

            handleUpload(file);
        }
    };

    const handleUpload = async (file: File) => {

        setIsUploading(true);

        const formData = new FormData();
        formData.append('file', file);

        try {
            await api.post('/images', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            
            setIsUploading(false);

            alert('이미지 업로드 성공!');

        } catch (error) {
            console.error('Error uploading image:', error);
            setIsUploading(false);
            alert('이미지 업로드 실패');
        }
    };

    return (
        <div className='AppContainer'>
            <div className='SpotlightBG'></div>
            
            <div className='Container'>

                {/* 헤더 */}
                <header className='BattleHeader'>
                    <div className='LiveBadge'>
                        <span className='PulsingDot'></span>
                        NOW SPOTLIGHT
                    </div>
                    <h1>지금 이 순간의 고양이: <span className="Highlight">{currentHighlightPhrase}</span></h1>
                    <p className="ChallengerText">{currentChallengerTextPhrase}</p>
                </header>

                {/* 메인 이미지 부분 */}
                <main className='ThroneSection'>
                    <div className='RatioFrame'>

                        {!mainImageLoaded && <div className='Skeleton'></div>}

                        <img src={mainImageUrl} alt="The Current Champion" className={mainImageLoaded ? 'loaded' : ''} onLoad={() => setMainImageLoaded(true)} />
                        <div className='ShineEffect'></div>
                    </div>
                </main>

                {/* 이미지 업로드 부분 */}
                <div className='ActionSection'>
                    <label
                        htmlFor='ChallengerUpload'
                        className={`SlimUploadBar ${isUploading ? 'Uploading' : ''}`}
                    >
                        <div className='BarContent'>
                            {isUploading ? (
                                <>
                                    <div className='Spinner'></div>
                                    <span>업로드 중...</span>
                                </>
                            ) : (
                                <>
                                    <svg xmlns='http://www.w3.org/2000/svg' width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="UploadIcon">
                                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
                                    </svg>
                                    <span>새로운 이미지로 왕좌 도전하기 (업로드)</span>
                                </>
                            )}
                        </div>
                        <input
                            type='file'
                            id='ChallengerUpload'
                            hidden
                            accept='.jpg,.jpeg,.png'
                            onChange={handleFileChange}
                            disabled={isUploading}
                        />
                    </label>
                </div>

                {/* 푸터 */}
                <footer className='SiteFooter'>
                    <div className='FooterContent'>
                        <div className='FooterColumn'>
                            <h3>ABOUT</h3>
                            <p>지금 이 순간의 귀여운 내 고양이를 자랑하자!</p>
                            <p>검토를 마친 단 한 장의 최신 이미지가 메인 화면의 주인공이 됩니다.</p>
                        </div>

                        <div className='FooterColumn'>
                            <h3>CONTACT</h3>
                            <p>Email: shm040806@gmail.com</p>
                            <p>GitHub: @ggm77</p>
                        </div>

                        <div className='FooterColumn'>
                            <h3>API CREDITS</h3>
                            <p>Fallback images provided by <a href="https://thecatapi.com/" target="_blank" rel="noreferrer">The Cat API</a> when user content is unavailable.</p>
                        </div>
                    </div>
                    <div className='FooterBottom'>
                        <p className="Copyright">&copy; 2025 ggm77. All rights reserved.</p>
                    </div>
                </footer>
            </div>
        </div>
    )
}

export default Home