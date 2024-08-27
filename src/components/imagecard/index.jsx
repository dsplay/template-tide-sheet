import './style.sass';

function ImageCard({ source }) {
  return (
    <div
      className="h-1/2 w-full max-w-full  rounded-xl overflow-hidden shadow-lg bg-white"
      style={{
        backgroundImage: `url(${source})`, backgroundRepeat: 'no-repeat', backgroundSize: 'cover', objectFit: 'cover', backgroundPosition: 'center',
      }}
    >
      &nbsp;
    </div>
  );
}

export default ImageCard;
