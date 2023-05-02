-- AddForeignKey
ALTER TABLE "locations" ADD CONSTRAINT "locations_address_id_fkey" FOREIGN KEY ("address_id") REFERENCES "addresses"("id") ON DELETE SET NULL ON UPDATE CASCADE;
