class AddUserRole < ActiveRecord::Migration
  def change
    add_column :users, :role, :string, default: nil
  end
end
