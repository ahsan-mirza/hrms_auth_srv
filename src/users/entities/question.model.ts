import {
    Table,
    Column,
    Model,
    DataType,
    BeforeCreate,
    HasMany,
} from 'sequelize-typescript';
import { nanoid } from 'nanoid';
import { UniqueIdGenerator } from 'src/utils/unique-id-generator';
import { QuestionAnswer } from './question-answer.model';
import { QUESTION_STATUS } from 'src/enum/status.enum';




@Table({
    tableName: 'questions',
    timestamps: true,
    paranoid: true,
})
export class Question extends Model {
    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    declare title: string; // The title of the question

    @Column({
        type: DataType.TEXT,
        allowNull: false,
    })
    declare description: string; // The detailed description of the question



    @Column({
        type: DataType.ENUM(...Object.values(QUESTION_STATUS)),
        defaultValue: QUESTION_STATUS.OPEN,
        allowNull: false,
    })
    declare status: QUESTION_STATUS


    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    declare identifier: string; // Unique identifier for the question



    @BeforeCreate
    static async generateIdentifier(instance: Question) {
        instance.identifier = await UniqueIdGenerator.generate({ prefix: 'question', model: Question, fieldName: 'identifier' });
    }

    @HasMany(() => QuestionAnswer)
    questionAnswers: QuestionAnswer[];

}