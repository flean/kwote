import { Meteor } from 'meteor/meteor'
import { Template } from 'meteor/templating'
import { FlowRouter } from 'meteor/kadira:flow-router'

Template.topMenu.onCreated(function () {

})

Template.topMenu.helpers({
    quoteImg() {
        return Meteor.userId() ? '/quote-w.png' : '/quote-b.png'
    },
    categoryImg() {
        return Meteor.userId() ? '/category-w.png' : '/category-b.png'
    },
    projectImg() {
        return Meteor.userId() ? '/project-w.png' : '/project-b.png'
    },
    authorImg() {
        return Meteor.userId() ? '/author-w.png' : '/author-b.png'
    },
    cogImg() {
        return Meteor.userId() ? '/cog-w.png' : '/cog-b.png'
    },
    notAllowed() {
        return Meteor.userId() ? 'autoCursor' : 'notAllowedCursor'
    }
})

Template.topMenu.events({
    'click #signOut': function (event, instance) {
        Meteor.logout((err) => {
            if (!err) {
                FlowRouter.go('/')
            }
        })
    },
    'click #btnKwotes': function (event, instance) {
        FlowRouter.go('kwotes')
    },
    'click #btnCategories': function (event, instance) {
        FlowRouter.go('categories')
    },
    'click #btnProjects': function (event, instance) {
        FlowRouter.go('projects')
    },
    'click #btnAuthors': function (event, instance) {
        FlowRouter.go('authors')
    }
})