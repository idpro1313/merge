// FILE: examples/code/module.java.example.java
// VERSION: 0.1.1
// START_MODULE_CONTRACT
//   PURPOSE: Показывает строгие поля GRACE-контракта, CLASS/METHOD и LDD-маркеры в Java.
//   SCOPE: Валидация входных данных, стабильная сборка результата и трассируемые решения.
//   DEPENDS: java.util.Map
//   LINKS: M-EXAMPLE / V-M-EXAMPLE
// END_MODULE_CONTRACT
//
// START_MODULE_MAP
//   RegistrationService - Валидирует регистрационные данные и возвращает стабильный результат.
//   registerUser - Primary registration decision function.
// END_MODULE_MAP
//
// START_CHANGE_SUMMARY
//   LAST_CHANGE: v0.1.1 — START_CLASS_/START_METHOD_ chunk anchors.
// END_CHANGE_SUMMARY

package examples.code;

import java.util.Map;

// START_CLASS_RegistrationService
// START_CONTRACT: RegistrationService
//   PURPOSE: Статический сервис регистрации (пример GRACE-разметки).
//   INPUTS: нет (utility class).
//   OUTPUTS: тип-контейнер для registerUser.
//   SIDE_EFFECTS: нет на уровне класса.
//   LINKS: M-EXAMPLE
// END_CONTRACT: RegistrationService
public final class RegistrationService {
    public record RegisterResult(boolean success, String userId, String error) {}

    private RegistrationService() {}

    // START_METHOD_logLdd
    // START_CONTRACT: logLdd
    //   PURPOSE: Печать LDD-маркера с полями.
    //   INPUTS: marker, fields
    //   OUTPUTS: void
    //   SIDE_EFFECTS: System.out
    //   LINKS: M-EXAMPLE
    // END_CONTRACT: logLdd
    private static void logLdd(String marker, Map<String, Object> fields) {
        System.out.println(marker + " " + fields);
    }
    // END_METHOD_logLdd

    // START_METHOD_registerUser
    // START_CONTRACT: registerUser
    //   PURPOSE: Регистрирует пользователя только после проверки username, password и email.
    //   INPUTS: { username: String, password: String, email: String }
    //   OUTPUTS: { RegisterResult - успех с userId или стабильная ошибка отказа }
    //   SIDE_EFFECTS: Пишет строгие LDD-маркеры; пример не сохраняет данные.
    //   LINKS: V-M-EXAMPLE scenario-registration
    //   PRECONDITIONS: trimmed username длиной >= 3; password длиной >= 8; email не пустой.
    //   POSTCONDITIONS: некорректный ввод возвращает VALIDATION_ERROR без BLOCK_CREATE_USER.
    //   INVARIANTS: password никогда не логируется; все причины отказа - стабильные коды.
    //   FORBIDDEN_CHANGES: не удалять проверку длины password и не логировать raw password.
    //   KEYWORDS: DOMAIN(Auth); CONCEPT(Validation); PATTERN(ResultObject)
    // END_CONTRACT: registerUser
    public static RegisterResult registerUser(String username, String password, String email) {
        // START_BLOCK_VALIDATE_INPUT
        String trimmedUsername = username == null ? "" : username.trim();
        boolean valid = trimmedUsername.length() >= 3
            && password != null
            && password.length() >= 8
            && email != null
            && !email.trim().isEmpty();

        if (!valid) {
            logLdd("[VALIDATION][IMP:9][registerUser][BLOCK_VALIDATE_INPUT][DECISION] registration rejected [STATUS:FAIL]", Map.of(
                "usernameLength", trimmedUsername.length(),
                "passwordLength", password == null ? 0 : password.length(),
                "hasEmail", email != null && !email.trim().isEmpty(),
                "reason", "VALIDATION_ERROR"
            ));
            return new RegisterResult(false, null, "VALIDATION_ERROR");
        }
        // END_BLOCK_VALIDATE_INPUT

        // START_BLOCK_CREATE_USER
        String userId = "user_" + trimmedUsername.toLowerCase();
        logLdd("[LOGIC][IMP:9][registerUser][BLOCK_CREATE_USER][STATE_CHANGE] user accepted [STATUS:OK]", Map.of(
            "userId", userId
        ));
        // END_BLOCK_CREATE_USER
        return new RegisterResult(true, userId, null);
    }
    // END_METHOD_registerUser
}
// END_CLASS_RegistrationService
