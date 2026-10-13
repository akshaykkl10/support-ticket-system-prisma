-- Remove existing foreign-key constraints.
ALTER TABLE "assignment"
DROP CONSTRAINT "assignment_ticket_id_fkey";

ALTER TABLE "comments"
DROP CONSTRAINT "comments_ticket_id_fkey";

ALTER TABLE "status_history"
DROP CONSTRAINT "status_history_ticket_id_fkey";

ALTER TABLE "ticket_tags"
DROP CONSTRAINT "ticket_tags_ticket_id_fkey";


-- Recreate the constraints with cascading deletion.
ALTER TABLE "assignment"
ADD CONSTRAINT "assignment_ticket_id_fkey"
FOREIGN KEY ("ticket_id")
REFERENCES "ticket"("id")
ON DELETE CASCADE
ON UPDATE NO ACTION;

ALTER TABLE "comments"
ADD CONSTRAINT "comments_ticket_id_fkey"
FOREIGN KEY ("ticket_id")
REFERENCES "ticket"("id")
ON DELETE CASCADE
ON UPDATE NO ACTION;

ALTER TABLE "status_history"
ADD CONSTRAINT "status_history_ticket_id_fkey"
FOREIGN KEY ("ticket_id")
REFERENCES "ticket"("id")
ON DELETE CASCADE
ON UPDATE NO ACTION;

ALTER TABLE "ticket_tags"
ADD CONSTRAINT "ticket_tags_ticket_id_fkey"
FOREIGN KEY ("ticket_id")
REFERENCES "ticket"("id")
ON DELETE CASCADE
ON UPDATE NO ACTION;
