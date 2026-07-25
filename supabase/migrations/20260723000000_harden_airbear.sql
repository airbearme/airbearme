-- AirBear operational hardening: validation, query indexes, timestamps, and RLS coverage.

ALTER TABLE inventory ADD CONSTRAINT inventory_price_nonnegative CHECK (price >= 0);
ALTER TABLE inventory ADD CONSTRAINT inventory_stock_nonnegative CHECK (stock_quantity >= 0);
ALTER TABLE rides ADD CONSTRAINT rides_num_riders_positive CHECK (num_riders > 0);
ALTER TABLE rides ADD CONSTRAINT rides_amounts_nonnegative CHECK (COALESCE(base_fare, 0) >= 0 AND COALESCE(items_total, 0) >= 0 AND COALESCE(total_amount, 0) >= 0);
ALTER TABLE rides ADD CONSTRAINT rides_rating_valid CHECK (rating IS NULL OR rating BETWEEN 1 AND 5);
ALTER TABLE ride_items ADD CONSTRAINT ride_items_quantity_positive CHECK (quantity > 0);
ALTER TABLE ride_items ADD CONSTRAINT ride_items_prices_nonnegative CHECK (unit_price >= 0 AND total_price >= 0);
ALTER TABLE ride_items ADD CONSTRAINT ride_items_total_matches_quantity CHECK (total_price = unit_price * quantity);

CREATE INDEX IF NOT EXISTS rides_user_created_idx ON rides (user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS rides_driver_status_idx ON rides (driver_id, status) WHERE driver_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS rides_status_created_idx ON rides (status, created_at DESC);
CREATE INDEX IF NOT EXISTS ride_items_ride_idx ON ride_items (ride_id);
CREATE INDEX IF NOT EXISTS payments_user_created_idx ON payments (user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS inventory_available_category_idx ON inventory (category, name) WHERE is_available;
CREATE INDEX IF NOT EXISTS chariots_available_idx ON chariots (is_available) WHERE is_available;

CREATE OR REPLACE FUNCTION set_updated_at() RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$;

DROP TRIGGER IF EXISTS users_set_updated_at ON users;
CREATE TRIGGER users_set_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION set_updated_at();
DROP TRIGGER IF EXISTS inventory_set_updated_at ON inventory;
CREATE TRIGGER inventory_set_updated_at BEFORE UPDATE ON inventory FOR EACH ROW EXECUTE FUNCTION set_updated_at();
DROP TRIGGER IF EXISTS drivers_set_updated_at ON drivers;
CREATE TRIGGER drivers_set_updated_at BEFORE UPDATE ON drivers FOR EACH ROW EXECUTE FUNCTION set_updated_at();
DROP TRIGGER IF EXISTS chariots_set_updated_at ON chariots;
CREATE TRIGGER chariots_set_updated_at BEFORE UPDATE ON chariots FOR EACH ROW EXECUTE FUNCTION set_updated_at();
DROP TRIGGER IF EXISTS rides_set_updated_at ON rides;
CREATE TRIGGER rides_set_updated_at BEFORE UPDATE ON rides FOR EACH ROW EXECUTE FUNCTION set_updated_at();
DROP TRIGGER IF EXISTS user_settings_set_updated_at ON user_settings;
CREATE TRIGGER user_settings_set_updated_at BEFORE UPDATE ON user_settings FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can add own ride items' AND tablename = 'ride_items') THEN
    CREATE POLICY "Users can add own ride items" ON ride_items FOR INSERT TO authenticated
      WITH CHECK (EXISTS (SELECT 1 FROM rides WHERE rides.id = ride_items.ride_id AND rides.user_id = auth.uid()));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can update own rides' AND tablename = 'rides') THEN
    CREATE POLICY "Users can update own rides" ON rides FOR UPDATE TO authenticated
      USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can read own payments' AND tablename = 'payments') THEN
    CREATE POLICY "Users can read own payments" ON payments FOR SELECT TO authenticated USING (user_id = auth.uid());
  END IF;
END
$$;
