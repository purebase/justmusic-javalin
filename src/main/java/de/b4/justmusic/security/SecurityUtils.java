package de.b4.justmusic.security;

import de.b4.justmusic.service.ConfigService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import sun.misc.BASE64Decoder;
import sun.misc.BASE64Encoder;

import javax.crypto.Cipher;
import javax.crypto.spec.SecretKeySpec;
import java.io.UnsupportedEncodingException;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Arrays;

public class SecurityUtils {
  private static Logger log = LoggerFactory.getLogger(SecurityUtils.class);

  public static String encodeString(String in) {
    try {
      Cipher cipher = Cipher.getInstance("AES");
      cipher.init(Cipher.ENCRYPT_MODE, getSecretKeySpec());
      byte[] encrypted = cipher.doFinal(in.getBytes());

      BASE64Encoder base64Encoder = new BASE64Encoder();

      return base64Encoder.encode(encrypted);
    } catch (Exception e) {
      log.error("Could not encode text", e);
      e.printStackTrace();
    }
    return null;
  }

  public static String decodeString(String in) {
    try {
      BASE64Decoder base64Decoder = new BASE64Decoder();
      byte[] crypted = base64Decoder.decodeBuffer(in);

      Cipher cipher = Cipher.getInstance("AES");
      cipher.init(Cipher.DECRYPT_MODE, getSecretKeySpec());
      byte[] cipherData = cipher.doFinal(crypted);
      return new String(cipherData);
    } catch (Exception e) {
      log.error("Could not decode text", e);
    }
    return null;
  }

  private static SecretKeySpec getSecretKeySpec() throws UnsupportedEncodingException, NoSuchAlgorithmException {
    byte[] key = ConfigService.getConfig().getSecuritySecret().getBytes("UTF-8");
    MessageDigest sha = MessageDigest.getInstance("SHA-256");
    key = sha.digest(key);
    key = Arrays.copyOf(key, 16);
    return new SecretKeySpec(key, "AES");
  }
}
