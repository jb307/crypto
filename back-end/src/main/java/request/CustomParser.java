package request;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class CustomParser {

  public static ParsedRequest parse(String request) {
    ParsedRequest parsedRequest = new ParsedRequest();

    String[] req = request.split("(\r\n|\r|\n)");
    boolean reachedEmptyLine = false;

    // Parse the request line (e.g., "POST /createUser?param1=value1&param2=value2 HTTP/1.1")
    String[] reqLineParts = req[0].split(" ");
    parsedRequest.setMethod(reqLineParts[0]);

    // Check if there's a query string
    String[] pathAndQuery = reqLineParts[1].split("\\?");
    parsedRequest.setPath(pathAndQuery[0]);

    for (int i = 1; i < req.length; i++) {
      String line = req[i];
      if (line.isEmpty()) {
        reachedEmptyLine = true;
        continue; // Skip the empty line
      }

      if (!reachedEmptyLine) {
        String[] headerParts = line.split(": ");
        if (headerParts.length == 2) {
          String key = headerParts[0];
          String value = headerParts[1];
          parsedRequest.setHeaderValue(key, value);

          if (key.equalsIgnoreCase("Cookie")) {
            // Parse the "Cookie" header
            String[] cookies = value.split("; ");
            for (String cookie : cookies) {
              String[] cookieParts = cookie.split("=");
              if (cookieParts.length == 2) {
                String cookieKey = cookieParts[0];
                String cookieValue = cookieParts[1];
                parsedRequest.setCookieValue(cookieKey, cookieValue);
              }
            }
          }
        }
      }
    }

    if (pathAndQuery.length > 1) {
      String[] queryParams = pathAndQuery[1].split("&");
      for (String param : queryParams) {
        String[] keyValue = param.split("=");
        if (keyValue.length == 2) {
          parsedRequest.setQueryParam(keyValue[0], keyValue[1]);
        }
      }
    }

    // Find the empty line that separates headers from the body
    int emptyLineIndex = 1;
    for (int i = 1; i < req.length; i++) {
      if (req[i].isEmpty()) {
        emptyLineIndex = i;
        break;
      }
    }

    // Parse the body if there's content after the empty line
    if (emptyLineIndex < req.length - 1) {
      StringBuilder requestBody = new StringBuilder();
      for (int j = emptyLineIndex + 1; j < req.length; j++) {
        requestBody.append(req[j]).append("\n"); // Use "\n" to ensure compatibility
      }
      String requestBodyStr = requestBody.toString().trim();
      parsedRequest.setBody(requestBodyStr);
    }

    return parsedRequest;
  }
}
