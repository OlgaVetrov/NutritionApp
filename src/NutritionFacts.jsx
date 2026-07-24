export const Nutrition = ({ label, quantity }) => {
  return (
    <div className="container inside">
      <p>
        <b>{label}</b> : {quantity}
      </p>
    </div>
  );
};
