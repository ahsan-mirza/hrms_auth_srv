'use strict';

/** @type {import('sequelize-cli').Migration} */
const { nanoid } = require('nanoid');
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     * 
     * 
     * 
    */

    const dummy_questions = [
      {
        title: 'Do you have any prior experience with MLM or affiliate marketing?',
        description: 'Tell us about your past experience, if any, in multi-level marketing or affiliate programs.',
        status: 'OPEN',
      },
      {
        title: 'How much time can you dedicate to promoting our products each week?',
        description: 'This will help us guide you with a strategy that fits your availability.',
        status: 'OPEN',
      },
      {
        title: 'What is your preferred method of marketing?',
        description: 'Select from options like social media, email marketing, word-of-mouth, or others.',
        status: 'OPEN',
      },
      {
        title: 'Are you comfortable recruiting others to join your network?',
        description: 'Explain your approach to referrals or team-building in a business model like MLM.',
        status: 'OPEN',
      },
      {
        title: 'Do you already have a following or community?',
        description: 'Let us know if you have an existing audience such as on social media, YouTube, blog, etc.',
        status: 'OPEN',
      },
      {
        title: 'Are you looking for full-time income or side income?',
        description: 'Choose your goal so we can align your path with the right compensation strategy.',
        status: 'OPEN',
      },
      {
        title: 'What motivates you to join our MLM platform?',
        description: 'Share what excites or inspires you about this opportunity.',
        status: 'OPEN',
      },
      {
        title: 'Do you have any specific earning goals in mind?',
        description: 'Setting a target helps us help you track and grow your progress.',
        status: 'OPEN',
      },
      {
        title: 'Would you like to receive training or onboarding support?',
        description: 'Let us know if you’re interested in training materials, webinars, or mentorship.',
        status: 'OPEN',
      }
    ]
    
    const now = new Date();
    const data = await Promise.all(dummy_questions.map(async (question) => ({
      ...question,
      identifier: `question-${nanoid(20)}`,
      created_at: now,
      updated_at: now,
    })));

    await queryInterface.bulkInsert('questions', data);
  },

  async down (queryInterface, Sequelize) {
    
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('questions', {}, {});
  }
};
