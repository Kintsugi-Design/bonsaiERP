class ChangeHistoriesAllDataHstore < ActiveRecord::Migration[5.2]
  def up
    PgTools.with_schemas except: 'common' do
      #change_column :histories, :history_data, :json
      execute("ALTER TABLE histories ALTER COLUMN all_data TYPE json USING all_data::json")
      execute("ALTER TABLE histories ALTER COLUMN all_data SET DEFAULT '{}'::json")
    end
  end

  def down
    PgTools.with_schemas except: 'common' do
      execute("ALTER TABLE histories ALTER COLUMN all_data TYPE text")
    end
  end
end
