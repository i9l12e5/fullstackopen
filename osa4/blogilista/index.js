const app = require("./app");
const { PORT } = require("./utils/config");
const logger = require("./utils/logger");

app.listen(PORT, () => {
	logger.log(`Server running on port ${PORT}`);
});
