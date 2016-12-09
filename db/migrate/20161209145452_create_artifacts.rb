class CreateArtifacts < ActiveRecord::Migration
  def change
    create_table :artifacts do |t|
      t.text :thumbnail
      t.text :code
      t.references :user, index: true
      t.text :image

      t.timestamps null: false
    end
    add_foreign_key :artifacts, :users
  end
end
