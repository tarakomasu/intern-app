class CreateCompanies < ActiveRecord::Migration[8.0]
  def change
    create_table :companies do |t|
      t.text :email
      t.text :password
      t.text :name
      t.text :description
      t.text :web
      t.text :logo_url

      t.timestamps
    end
  end
end
