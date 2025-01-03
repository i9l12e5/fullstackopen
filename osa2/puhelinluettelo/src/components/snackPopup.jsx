export const SnackPopup = ({ props }) => {
	const getColor = (value) => {
		switch (value) {
			case 1:
				return "green";

			case 2:
				return "orange";

			case 3:
				return "red";

			default:
				return "grey";
		}
	};

	return (
		<div
			style={{
				visibility: props.show ? "visible" : "hidden",
				border: `3px solid ${getColor(props.type)}`,
				backgroundColor: "darkgray",
				padding: "10px",
				borderRadius: "4px",
				fontWeight: "bold",
				color: getColor(props.type),
			}}
		>
			{props.msg}
		</div>
	);
};
