import { Template } from 'meteor/templating'
import { Spacebars } from 'meteor/spacebars'
import { FlowRouter } from 'meteor/kadira:flow-router'
import { Session } from 'meteor/session'
import { ReactiveVar } from 'meteor/reactive-var'
import { _ } from 'meteor/underscore'
import { $ } from 'meteor/jquery'
import moment from 'moment'
import { Kwote, Quotes, Projects } from '../../lib/kwote'

Template.kwotesList.onCreated(function () {
    const self = this

    self.loaded = new ReactiveVar(0);
    self.limit = new ReactiveVar(Kwote.defaultLimit)

    self.getSearch = () => {
        let search = Session.get(Kwote.KwoteSearchKey) || { limit: 10, title: '' }
        if (!_.isObject(search)) {
            search = { limit: 10, title: '' }
        }
        return search
    }

    self.autorun(function () {
        const search = Session.get(Kwote.KwoteSearchKey) || { limit: 10, title: '' }
        const subscription = self.subscribe('myQuotes', search)

        if (subscription.ready()) {
            self.loaded.set(Quotes.find().count())
        }
    })

    self.scrollToOffset = (value) => {
        $('html, body').animate(
            {
                scrollTop: value
            },
            750,
            'swing'
        );
    }
})

Template.kwotesList.onRendered(function () {
    const scrollVal = Session.get(Kwote.ListScrollValue) || 0
    if (scrollVal > 0) {
        Template.instance().scrollToOffset(scrollVal)
        Session.set(Kwote.ListScrollValue, 0)
    }
})

Template.kwotesList.helpers({
    hasQuotes() {
        return Quotes.find({}).count() > 0
    },
    hasMoreQuotes() {
        const instance = Template.instance()
        const search = instance.getSearch()
        return instance.loaded.get() === search.limit
    },
    kwote() {
        return Quotes.find({}, { sort: { title: 1 } })
    },
    truncedBody() {
        return Spacebars.SafeString(this.body.substring(0, 256))
    },
    addModify() {
        return false;
    },
    lastProject() {
        if (this.projects.length > 0) {
            const pid = this.projects[this.projects.length - 1]
            if (pid) {
                const p = Projects.findOne(pid)
                if (p) {
                    return p.title
                }
            }
        }
    },
    lastModified() {
        const dte = this.modifiedAt || this.createdAt
        return moment(dte).format('MM/DD/YYYY')
    },
    notFound() {
        const search = Session.get(Kwote.KwoteSearchKey) || { limit: 10, title: '' }
        if (search.title !== '') {
            return 'Search found no Kwotes!'
        }
        return 'No Kwotes found!'
    }
})

Template.kwotesList.events({
    'click #btnMore': function (event, instance) {
        const search = instance.getSearch()
        search.limit += Kwote.defaultLimit
        Session.set(Kwote.KwoteSearchKey, search)
        instance.scrollToOffset($('#btnMore').offset().top)
    }
})
