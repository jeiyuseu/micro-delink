const path = require('path')

module.exports = {
	devServer: {
		proxy: {
			'^/api/v1': {
				target: 'http://localhost:4000',
				logLevel: 'debug',
			},
		},
	},
	outputDir: path.resolve(__dirname, '../server/public'),
}
