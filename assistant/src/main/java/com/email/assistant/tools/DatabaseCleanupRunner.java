package com.email.assistant.tools;

import org.springframework.boot.CommandLineRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;
import org.springframework.beans.factory.annotation.Value;

@Component
public class DatabaseCleanupRunner implements CommandLineRunner {

    private final JdbcTemplate jdbc;

    @Value("${app.db.cleanup:false}")
    private boolean cleanupEnabled;

    public DatabaseCleanupRunner(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    @Override
    public void run(String... args) throws Exception {
        if (!cleanupEnabled) {
            return;
        }

        System.out.println("[DB-CLEANUP] Starting orphaned emails cleanup...");

        try {
            int deleted1 = jdbc.update(
                    "DELETE e FROM emails e LEFT JOIN users u ON e.user_id = u.id WHERE u.id IS NULL"
            );

            int deleted2 = jdbc.update(
                    "DELETE FROM emails WHERE user_id IS NULL"
            );

            System.out.println("[DB-CLEANUP] Deleted rows (orphan join): " + deleted1);
            System.out.println("[DB-CLEANUP] Deleted rows (null user_id): " + deleted2);

        } catch (Exception ex) {
            System.err.println("[DB-CLEANUP] Error during cleanup: " + ex.getMessage());
            ex.printStackTrace();
        }

        System.out.println("[DB-CLEANUP] Completed.");
    }
}
