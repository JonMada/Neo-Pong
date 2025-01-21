const Instrucciones = ({ player1Name }) => {
  return (
    <div className="instructions-container">
      <p>
        <span>{player1Name}</span> use W and S to move up and down.
      </p>
    </div>
  );
};

export default Instrucciones;
