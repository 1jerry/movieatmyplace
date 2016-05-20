Template.share.helpers({
	sharelink: function() {
		var link = getDomain()[0];
		if (link.indexOf("localhost") > -1)
			link = 'localhost:3000?eId=' + Session.get('eId');
		else
			link = 'moviewith.j3ry.com/?eId=' + Session.get('eId');
		return link;
	}
});
