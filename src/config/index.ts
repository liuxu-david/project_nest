import devConfig from "./dev.config";
import prodConfig from "./prod.config";

const configMap = {
  DEVELOPMENT: devConfig,
  PRODECTION: prodConfig
}

export default configMap[process.env.NODE_ENV] 