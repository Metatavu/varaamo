import passport from 'passport';
import { Strategy as HelsinkiStrategy } from 'passport-helsinki';
import KeycloakStrategy from "@exlinc/keycloak-passport";
import settings from '../../config/settings';

function configureHelsinkiStrategy() {
  return new HelsinkiStrategy({
      clientID: settings.CLIENT_ID,
      clientSecret: settings.CLIENT_SECRET,
      callbackURL: settings.LOGIN_CALLBACK_URL,
      proxy: Boolean(settings.PROXY)
    }, (accessToken, refreshToken, profile, cb) => {
      helsinkiStrategy.getAPIToken(accessToken, settings.TARGET_APP, (token) => {
        const profileWithToken = Object.assign({}, profile, { token });
        return cb(null, profileWithToken);
      });
  });
}

/**
 * Configures Keycloak authentication strategy
 */
function configureKeycloakStrategy() {
  const realm = settings.KEYCLOAK_REALM;
  const url = settings.KEYCLOAK_URL;

  return new KeycloakStrategy({
      host: url,
      realm: realm,
      clientID: settings.CLIENT_ID,
      clientSecret: settings.CLIENT_SECRET,
      callbackURL: settings.LOGIN_CALLBACK_URL || '/login/keycloak/return',
      authorizationURL: `${url}/auth/realms/${realm}/protocol/openid-connect/auth`,
      tokenURL: `${url}/auth/realms/${realm}/protocol/openid-connect/token`,
      userInfoURL: `${url}/auth/realms/${realm}/protocol/openid-connect/userinfo`,
    }, (accessToken, refreshToken, profileData, done) => {
      const profile = {
        id: profileData.keycloakId,
        displayName: profileData.fullName,
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        username: profileData.username,
        emails: [{
          value: profileData.email
        }],
        provider: settings.AUTH_PROVIDER,
        token: accessToken
      };

      done(null, profile)
    }
  );
}

function configurePassport() {
  const authProvider = settings.AUTH_PROVIDER;
  let strategy = null;

  switch (authProvider) {
    case 'helsinki':
      strategy = configureHelsinkiStrategy();
    break;
    case 'keycloak':
      strategy = configureKeycloakStrategy();
    break;
    default:
      return null;
  }
  
  passport.use(authProvider, strategy);

  passport.serializeUser((user, cb) => {
    cb(null, user);
  });

  passport.deserializeUser((obj, cb) => {
    cb(null, obj);
  });

  return passport;
}

export default configurePassport;