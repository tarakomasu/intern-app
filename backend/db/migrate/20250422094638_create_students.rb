class CreateStudents < ActiveRecord::Migration[8.0]
  def change
    create_table :students do |t|
      t.text :email
      t.text :password
      t.text :first_name
      t.text :given_name
      t.text :first_kana
      t.text :given_kana
      t.text :sex
      t.text :school
      t.text :faculty
      t.text :major
      t.text :grade
      t.text :graduate_year
      t.text :address
      t.text :pr
      t.text :schedule

      t.timestamps
    end
  end
end
