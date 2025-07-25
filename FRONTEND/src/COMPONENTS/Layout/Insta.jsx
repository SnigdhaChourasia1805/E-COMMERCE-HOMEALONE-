import React, { useEffect } from 'react';
import { InstagramEmbed } from 'react-social-media-embed';
import AOS from 'aos';
import 'aos/dist/aos.css';

const Insta = () => {
  useEffect(() => {
    // Initialize AOS
    AOS.init();
  }, []);

  return (
    <div className="background instagram">
      <div className="insta-heading">
        <h1>Instagram</h1>
      </div>
      <div className="instagram-posts">
        <InstagramEmbed data-aos="fade-up" url='https://www.instagram.com/reel/CjS4imFLBy1/?igsh=MWZwb3UydG1nYjh5NA==' />
        <InstagramEmbed data-aos="fade-up" url='https://www.instagram.com/reel/C1Kk5-INwH2/?igsh=MXAzcHUzaDZicXA4Yg==' />
        <InstagramEmbed data-aos="fade-up" url='https://www.instagram.com/reel/CidaTUMuNdn/?igsh=c2E4eXkxamhiMWtv' />
        <InstagramEmbed data-aos="fade-up" url='https://www.instagram.com/tv/CejdF0Hsft3/?igsh=MXd3YnRhcWtzdmszbQ==' />
        <InstagramEmbed data-aos="fade-up" url='https://www.instagram.com/tv/CcvGpxEgbIY/?igsh=ZjFsMnpvdng5aWFp' />
        <InstagramEmbed data-aos="fade-up" url='https://www.instagram.com/p/CF33VROpnAf/?igsh=N2hlNHFlNm1lZHh0' />
      </div>
    </div>
  );
};

export default Insta;
